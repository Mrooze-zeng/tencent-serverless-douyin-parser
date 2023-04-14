import FringerPrint from "@fingerprintjs/fingerprintjs";
import * as Api from "../apis";

export const commonPost = async (url = "", params = {}) => {
  const fp = await FringerPrint.load();
  const { visitorId } = await fp.get();
  return await fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      "Visitor-Id": visitorId,
    }),
    body: JSON.stringify({ ...params }),
  });
};

export const parserText = async (text = "") => {
  const response = await commonPost(Api.PARSER, { text });
  if (!response.ok) {
    throw Error(`An error has occured: ${response.status}`);
  }
  const data = await response.json();
  if (data.type === "success") {
    let dataSize =
      data.message?.aweme_list[0]?.video?.play_addr?.data_size || 0;
    let images = data.message?.aweme_list[0]?.images || [];
    let outputImages = [];
    images.forEach((image) => {
      outputImages.push(image?.url_list[0]);
    });
    return {
      videos:
        (dataSize
          ? data.message?.aweme_list[0]?.video?.play_addr?.url_list
          : outputImages) || [],
      size: dataSize,
    };
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
    return new Blob([buffer], { type: "video/mp4" });
  } else {
    const text = await buffer.text();
    const res = JSON.parse(text);
    throw Error(res.message);
  }
};
