import { useEffect, useState } from "react";


type HighchartsModule = (H: typeof import("highcharts")) => void;


export type ModuleName =
  | "exporting"
  | "export-data"
  | "offline-exporting"
  | "accessibility"
  | "windbarb"
  | "annotations"
  | "heatmap";


const moduleMap: Record<ModuleName, () => Promise<HighchartsModule>> = {
  exporting: () =>
    import("highcharts/modules/exporting").then(mod => mod.default || mod),
  "export-data": () =>
    import("highcharts/modules/export-data").then(mod => mod.default || mod),
  "offline-exporting": () =>
    import("highcharts/modules/offline-exporting").then(mod => mod.default || mod),
  accessibility: () =>
    import("highcharts/modules/accessibility").then(mod => mod.default || mod),
  windbarb: () =>
    import("highcharts/modules/windbarb").then(mod => mod.default || mod),
  annotations: () =>
    import("highcharts/modules/annotations").then(mod => mod.default || mod),
  heatmap: () =>
    import("highcharts/modules/heatmap").then(mod => mod.default || mod),
};


export const useHighchartsModules = (modules: ModuleName[]): [typeof import("highcharts") | null, boolean] => {
  const [Highcharts, setHighcharts] = useState<typeof import("highcharts") | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {

      const H = (await import("highcharts")).default;
      if (!mounted) return;

      for (const name of modules) {
        const moduleFn = await moduleMap[name]();
        moduleFn(H);
      }

      setHighcharts(H);
      setLoaded(true);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [modules]);

  return [Highcharts, loaded];
};
