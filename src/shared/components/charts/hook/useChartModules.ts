import { useEffect, useState } from "react";
import Highcharts from "highcharts";


type HighchartsModule = (H: typeof Highcharts) => void;

type ModuleName =
  | "exporting"
  | "export-data"
  | "offline-exporting"
  | "accessibility"
  | "windbarb"
  | "annotations"
  | "heatmap";


type ModuleImport = HighchartsModule | { default: HighchartsModule };

const moduleMap: Record<ModuleName, () => Promise<HighchartsModule>> = {
  exporting: () =>
    import("highcharts/modules/exporting").then(
      (mod: ModuleImport) =>
        (typeof mod === "function" ? mod : mod.default)
    ),

  "export-data": () =>
    import("highcharts/modules/export-data").then(
      (mod: ModuleImport) =>
        (typeof mod === "function" ? mod : mod.default)
    ),

  "offline-exporting": () =>
    import("highcharts/modules/offline-exporting").then(
      (mod: ModuleImport) =>
        (typeof mod === "function" ? mod : mod.default)
    ),

  accessibility: () =>
    import("highcharts/modules/accessibility").then(
      (mod: ModuleImport) =>
        (typeof mod === "function" ? mod : mod.default)
    ),

  windbarb: () =>
    import("highcharts/modules/windbarb").then(
      (mod: ModuleImport) =>
        (typeof mod === "function" ? mod : mod.default)
    ),

  annotations: () =>
    import("highcharts/modules/annotations").then(
      (mod: ModuleImport) =>
        (typeof mod === "function" ? mod : mod.default)
    ),

  heatmap: () =>
    import("highcharts/modules/heatmap").then(
      (mod: ModuleImport) =>
        (typeof mod === "function" ? mod : mod.default)
    ),
};

/**
 * Dynamically loading higcharts Modules
 * @param modules module names 
 * @returns isModuleReady boolean
 */
export const useHighchartsModules = (modules: ModuleName[]) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      for (const name of modules) {
        const moduleFn = await moduleMap[name]();
        moduleFn(Highcharts);
      }
      if (mounted) setLoaded(true);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [modules]);

  return loaded;
};
