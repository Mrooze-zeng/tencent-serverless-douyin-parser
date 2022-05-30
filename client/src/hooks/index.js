import { useEffect, useState } from "react";
import { fetchBufferUrl, parserText } from "../requests";
export const useGetVideos = (defaultText = "") => {
  const [videos, setVideos] = useState([]);
  const [size, setSize] = useState(0);
  const getVideos = async (text = "") => {
    try {
      const { videos = [], size = 0 } = await parserText(text);
      setVideos([...videos]);
      setSize(size);
    } catch (e) {
      alert(e.message);
    }
  };
  useEffect(() => {
    defaultText && getVideos(defaultText);
  });
  return [videos, size, getVideos, setVideos];
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
