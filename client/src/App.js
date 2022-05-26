import { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useFetchBufferUrl, useGetVideos } from "./hooks";
import { copyTextToClipboard, downloadUrl } from "./utils";

const App = () => {
  const [modalShow, setModalShow] = useState(false);
  const [videos, getVideos, setVideos] = useGetVideos("");
  const [url, getUrl, setUrl] = useFetchBufferUrl("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalShow(true);
    await getVideos(e.target.text.value);
    setModalShow(false);
  };
  const handleReset = () => {
    setVideos([]);
  };
  const handleClose = () => {
    setModalShow(false);
  };

  const handleCopy = async (text = "") => {
    const message = await copyTextToClipboard(text);
    alert(message);
  };

  const handleDownload = async (url = "") => {
    setModalShow(true);
    const link = await getUrl(url);
    downloadUrl(link);
    setModalShow(false);
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
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Modal.Body>
      </Modal>
      <div className="container mt-5">
        {videos &&
          videos.map((address, index) => {
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
      <footer className="position-absolute bottom-0 text-center w-100">
        <p>
          <a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">
            ICP主体备案号:粤ICP备17043808号
          </a>
        </p>
      </footer>
    </>
  );
};

export default App;
