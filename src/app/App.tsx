import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import { Mino } from "mino"

import useWindowEventListener from "./useWindowEventListener"
import Nav from "./Nav"
import Layout from "./Layout"
import { getCanonical } from "./graph"
import InfoButton from "./InfoButton"
import Compass from "./Compass"
import FamilyTree from "./FamilyTree"
import MinoList from "./MinoList"

export default function App() {
  const [selected, setSelected] = React.useState<Mino | undefined>()

  // Deselect when pressing 'escape'
  useWindowEventListener("keydown", (e) => {
    if (e.which === 27) {
      setSelected(undefined)
    }
  })

  return (
    <BrowserRouter>
      <Layout
        topLeft={<Nav />}
        topRight={
          selected ? (
            <Compass mino={selected} onSelect={setSelected} />
          ) : undefined
        }
        bottomLeft={<InfoButton />}
      >
        <Routes>
          <Route
            path="/"
            element={
              <FamilyTree
                selected={selected && getCanonical(selected)}
                onSelect={setSelected}
              />
            }
          />
          <Route
            path="/list"
            element={<MinoList selected={selected} onSelect={setSelected} />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
