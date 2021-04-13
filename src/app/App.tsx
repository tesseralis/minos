import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import KeyBindings from "./KeyBindings"
import Nav from "./Nav"
import Layout from "./Layout"
import SelectedContext from "./SelectedContext"
import Compass from "./Compass"
import FamilyTree from "./FamilyTree"
import ListPage from "./ListPage"
import PatternPage from "./PackingPage"
import TilingPage from "./TilingPage"
import ClassesPage from "./ClassesPage"

export default function App() {
  return (
    <SelectedContext.Provider>
      <KeyBindings />
      <BrowserRouter>
        <Layout topLeft={<Nav />} topRight={<Compass />}>
          <Routes>
            <Route path="/" element={<Navigate to="/genealogy" />} />
            <Route path="/catalog" element={<ListPage />} />
            {/* TODO: put this logic in <PatternPage somehow/> */}
            <Route
              path="/packing"
              element={<Navigate to="/packing/5/rect" />}
            />
            <Route path="/packing/:size/:shape" element={<PatternPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/tiling" element={<TilingPage />} />
            <Route path="/tiling/:mino" element={<TilingPage />} />
            <Route path="/genealogy" element={<FamilyTree />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </SelectedContext.Provider>
  )
}
