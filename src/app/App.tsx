import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import KeyBindings from "./KeyBindings"
import Nav from "./Nav"
import Layout from "./Layout"
import SelectedContext from "./SelectedContext"
import InfoButton from "./InfoButton"
import Compass from "./Compass"
import FamilyTree from "./FamilyTree"
import MinoList from "./MinoList"

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
            <Route path="/" element={<FamilyTree />} />
            <Route path="/list" element={<MinoList />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </SelectedContext.Provider>
  )
}
