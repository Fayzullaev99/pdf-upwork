import React, { useEffect, useRef, useState } from "react";

export const Page = ({ page, dimensions, updateDimensions }) => {
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(dimensions?.width || 0);
  const [height, setHeight] = useState(dimensions?.height || 0);

  useEffect(() => {
    const renderPage = async () => {
      if (!page) return;

      const _page = await page;
      const context = canvasRef.current?.getContext("2d");

      if (_page && context) {
        const viewport = _page.getViewport({ scale: 1 });

        setWidth(viewport.width);
        setHeight(viewport.height);

        await _page.render({
          canvasContext: context,
          viewport,
        }).promise;

        const newDimensions = {
          width: viewport.width,
          height: viewport.height,
        };

        updateDimensions(newDimensions);
      }
    };

    renderPage();
  }, [page, updateDimensions]);

  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
