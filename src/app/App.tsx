import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import KeyBindings from "./KeyBindings"
import Nav from "./Nav"
import Layout from "./Layout"
import HomePage from "./HomePage"
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
          <Route path="/" element={<HomePage />} />
          {/* TODO: put the double logic in the individual pages somehow */}
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/catalog/:mino" element={<CatalogPage />} />
          <Route path="/packing" element={<PatternPage />} />
          <Route path="/packing/:pattern" element={<PatternPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/tiling" element={<TilingPage />} />
          <Route path="/tiling/:mino" element={<TilingPage />} />
          <Route path="/genealogy" element={<FamilyTree />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
