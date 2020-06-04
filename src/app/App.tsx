import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

// import useWindowEventListener from "./useWindowEventListener"
import Nav from "./Nav"
import Layout from "./Layout"
import { SelectedProvider } from "./SelectedContext"
import InfoButton from "./InfoButton"
import Compass from "./Compass"
import FamilyTree from "./FamilyTree"
import MinoList from "./MinoList"

export default function App() {
  // const [selected, setSelected] = React.useState<Mino | undefined>()

  // FIXME re-enable this
  // Deselect when pressing 'escape'
  // useWindowEventListener("keydown", (e) => {
  //   if (e.which === 27) {
  //     setSelected(undefined)
  //   }
  // })

  return (
    <SelectedProvider>
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
    </SelectedProvider>
  )
}
