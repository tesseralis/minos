import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import KeyBindings from "./KeyBindings"
import Nav from "./Nav"
import Layout from "./Layout"
import FamilyTree from "./FamilyTree"
import CatalogPage from "./CatalogPage"
import PatternPage from "./PackingPage"
import TilingPage from "./TilingPage"
import ClassesPage from "./ClassesPage"

export default function App() {
  return (
    <BrowserRouter>
      <KeyBindings />
      <Layout topLeft={<Nav />}>
        <Routes>
          <Route path="/" element={<Navigate to="/genealogy" />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/catalog/:mino" element={<CatalogPage />} />
          {/* TODO: put this logic in <PatternPage somehow/> */}
          <Route path="/packing" element={<Navigate to="/packing/5/rect" />} />
          <Route path="/packing/:size/:shape" element={<PatternPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/tiling" element={<TilingPage />} />
          <Route path="/tiling/:mino" element={<TilingPage />} />
          <Route path="/genealogy" element={<FamilyTree />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
