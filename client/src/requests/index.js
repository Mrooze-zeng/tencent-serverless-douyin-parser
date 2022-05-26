import * as Api from "../apis";

export const commonPost = async (url = "", params = {}) => {
  return await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(params),
  });
};

export const parserText = async (text = "") => {
  const response = await commonPost(Api.PARSER, { text });
  if (!response.ok) {
    throw Error(`An error has occured: ${response.status}`);
  }
  const data = await response.json();
  if (data.type === "success") {
    return data.message?.aweme_detail?.video?.play_addr?.url_list || [];
  } else {
    throw Error(data.message);
  }
};

export const fetchBufferUrl = async (url = "") => {
  const response = await commonPost(Api.DONWLOAD, { url });
  if (!response.ok) {
    throw Error(`An error has occured: ${response.status}`);
  }
  const buffer = await response.blob();
  if (buffer.type === "application/octet-stream") {
    const videoBuffer = new Blob([buffer], { type: "video/mp4" });
    return buffer && URL.createObjectURL(videoBuffer);
  } else {
    const text = await buffer.text();
    const res = JSON.parse(text);
    throw Error(res.message);
  }
};
