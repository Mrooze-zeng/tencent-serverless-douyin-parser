import { useEffect, useState } from "react";
import { fetchBufferUrl, parserText } from "../requests";
export const useGetVideos = (defaultText = "") => {
  const [videos, setVideos] = useState([]);
  const getVideos = async (text = "") => {
    try {
      const addresses = await parserText(text);
      setVideos([...addresses]);
    } catch (e) {
      alert(e.message);
    }
  };
  useEffect(() => {
    defaultText && getVideos(defaultText);
  });
  return [videos, getVideos, setVideos];
};

export const useFetchBufferUrl = (defaultUrl = "") => {
  const [buffer, setBuffer] = useState();
  const getBuffer = async (url = "") => {
    const buffer = await fetchBufferUrl(url);
    setBuffer(buffer);
    return buffer;
  };
  useEffect(() => {
    defaultUrl && getBuffer(defaultUrl);
  });
  return [buffer, getBuffer, setBuffer];
};
