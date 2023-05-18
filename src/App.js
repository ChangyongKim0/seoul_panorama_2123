import React, { Component, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { GlobalVarProvider } from "./hooks/useGlobalVar";
import { GlobalDataProvider } from "./hooks/useGlobalData";
// import { ZIndexProvider } from "./functions/Zindexer";
// import { BldgInfoDataProvider } from "./hooks/useBldgInfoData";
// import { CookieDataProvider } from "./hooks/useCookieData";
// import { OverlayReloaderProvider } from "./hooks/useOverlayReloader";
// import { UnitTypeProvider } from "./hooks/useUnitType";
// import { ValuationCalculatorProvider } from "./hooks/useValuationCalculator";
import {
  NotFound,
  StartPage,
  IntroductionPage,
  NicknamingPage,
  MapPage,
  DesignPage,
  OverlayPage,
  EnterPage,
  IntroductionPage2,
  TuringTestPage,
  TorturingMountainPage,
  EnterPageOld,
  ThreeTestPage,
} from "./pages";
import { AnimatePresence } from "framer-motion/dist/framer-motion";

const App = () => {
  const location = useLocation();

  return (
    <GlobalVarProvider>
      <GlobalDataProvider>
        <AnimatePresence>
          <Routes location={location} key={location.pathname.split("/")[1]}>
            <Route key="/" path="/" element={<StartPage />} />
            <Route key="/" path="/enter" element={<EnterPage />} />
            <Route key="/" path="/enter2" element={<EnterPageOld />} />
            <Route
              key="/"
              path="/introduction/1"
              element={<IntroductionPage />}
            />
            <Route
              key="/"
              path="/introduction/2"
              element={<IntroductionPage2 />}
            />
            <Route key="/" path="/turingtest" element={<TuringTestPage />} />
            <Route
              key="/"
              path="/torturingmountain"
              element={<TorturingMountainPage />}
            />
            <Route key="/" path="/nicknaming" element={<NicknamingPage />} />
            <Route key="/" path="/map" element={<MapPage />} />
            <Route key="/design" path="/design" element={<DesignPage />} />
            <Route
              key="/threetest"
              path="/threetest"
              element={<ThreeTestPage />}
            />
            <Route element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </GlobalDataProvider>
    </GlobalVarProvider>
  );
};

export default App;
