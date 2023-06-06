import { useEffect, useMemo, useState } from "react";

const useSvgNest = () => {
  const [svg_str, setSvgStr] = useState();
  const [output, setOutput] = useState();
  const [onProgress, setOnProgress] = useState(() => {});
  const [onRenderSvg, setOnRenderSvg] = useState(() => {});
  useEffect(() => {
    const svg_nest = new window.SvgNest();
    const progress = (percent) => {
      console.log(percent);
      onProgress?.();
    };

    const renderSvg = (svglist, efficiency, placed, total) => {
      setOutput({ svglist, efficiency, placed, total });
      svg_nest.stop();
      console.log(svglist, efficiency, placed, total);
      console.log(
        Array.from(svglist?.[0]?.children).map(
          (e) => e?.transform?.baseVal?.consolidate?.()?.matrix
        )
      );
      console.log(
        Array.from(svglist?.[0]?.children).map((e) => e?.children?.[0]?.id)
      );
      onRenderSvg?.();
    };
    try {
      const parsed_svgs = svg_nest?.parsesvg?.(svg_str);
      //   console.log(parsed_svgs);
      svg_nest.setbin(parsed_svgs.children[0]);
      svg_nest.stop();
      svg_nest.start(progress, renderSvg);
    } catch {}
  }, [svg_str, onProgress, onRenderSvg]);

  return [output, setSvgStr, setOnProgress, setOnRenderSvg];
};

export default useSvgNest;
