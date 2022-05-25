import { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";

const App = () => {
  const [videoAddresses, setVideoAddresses] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalShow(true);
    setVideoAddresses([]);
    const text = e.target.text.value;
    const res = await fetch("/api/parser", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setModalShow(false);
    if (data.type === "success") {
      setVideoAddresses(data.message?.aweme_detail?.video?.play_addr?.url_list);
    } else {
      alert(data.message);
    }
  };
  const handleReset = () => {
    setVideoAddresses([]);
  };
  const handleClose = () => {
    setModalShow(false);
  };
  const copyTextToClipboard = (text = "") => {
    return new Promise((resolve, reject) => {
      if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        let message = "";
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          var successful = document.execCommand("copy");
          var msg = successful ? "successful" : "unsuccessful";
          message = "Fallback: Copying text command was " + msg;
        } catch (err) {
          message = "Fallback: Oops, unable to copy " + err;
        }
        textArea.remove();
        return resolve(message);
      } else {
        navigator.clipboard.writeText(text).then(
          function () {
            resolve("Async: Copying to clipboard was successful!");
          },
          function (err) {
            resolve("Async: Could not copy text: " + err);
          },
        );
      }
    });
  };
  const handleCopy = async (text = "") => {
    const message = await copyTextToClipboard(text);
    alert(message);
  };
  const createLink = (blobUrl = "") => {
    const randomFilename = Math.random().toString(36).slice(2);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = blobUrl;
    a.download = `${randomFilename}.mp4`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(blobUrl);
    a.remove();
  };
  const handleDownload = async (url = "") => {
    const response = await fetch("/api/download", {
      method: "POST",
      body: JSON.stringify({ url: url }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    const buffer = await response.blob();
    if (buffer.type === "application/octet-stream") {
      const videoBuffer = new Blob([buffer], { type: "video/mp4" });
      buffer && createLink(URL.createObjectURL(videoBuffer));
    } else {
      const text = await buffer.text();
      const res = JSON.parse(text);
      alert(res.message);
    }
  };
  return (
    <>
      <div className="container">
        <h1 className="text-center">无水印下载抖音小视频</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="text" className="form-label">
              抖音分享的链接:
            </Form.Label>
            <Form.Control
              as="textarea"
              name="text"
              id="text"
              className="form-control"
              placeholder="请填入抖音分享的链接"
              cols="15"
              rows="5"
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="text-end">
            <Button
              type="reset"
              variant="secondary"
              className="mx-2"
              onClick={handleReset}
            >
              重置
            </Button>
            <Button variant="primary" type="submit">
              获取
            </Button>
          </Form.Group>
        </Form>
      </div>
      <Modal
        show={modalShow}
        centered
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Modal.Body>
      </Modal>
      <div className="container mt-5">
        {videoAddresses &&
          videoAddresses.map((address, index) => {
            return (
              <div key={index}>
                <Button
                  variant="link"
                  className="mx-2"
                  title="点击复制下载链接"
                  onClick={() => handleCopy(address)}
                >
                  链接 {index + 1}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownload(address)}
                >
                  远程下载
                </Button>
              </div>
            );
          })}
      </div>
      <footer className="position-absolute top-100 start-50 translate-middle">
        <p className="mb-5">
          <a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">
            ICP主体备案号:粤ICP备17043808号
          </a>
        </p>
      </footer>
    </>
  );
};

export default App;
