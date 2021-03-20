import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import KeyBindings from "./KeyBindings"
import Nav from "./Nav"
import Layout from "./Layout"
import SelectedContext from "./SelectedContext"
import InfoButton from "./InfoButton"
import Compass from "./Compass"
import FamilyTree from "./FamilyTree"
import MinoList from "./MinoList"
import PatternPage from "./PatternPage"
import TilingPage from "./TilingPage"

export default function App() {
  return (
    <SelectedContext.Provider>
      <KeyBindings />
      <BrowserRouter>
        <Layout
          topLeft={<Nav />}
          topRight={<Compass />}
          bottomLeft={<InfoButton />}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/graph" />} />
            <Route path="/graph" element={<FamilyTree />} />
            <Route path="/list" element={<MinoList />} />
            {/* TODO: put this logic in <PatternPage somehow/> */}
            <Route
              path="/pattern"
              element={<Navigate to="/pattern/5/rect" />}
            />
            <Route path="/pattern/:size/:shape" element={<PatternPage />} />
            {/* TODO landing page for the /tiling route */}
            <Route path="/tiling/:mino" element={<TilingPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </SelectedContext.Provider>
  )
}
