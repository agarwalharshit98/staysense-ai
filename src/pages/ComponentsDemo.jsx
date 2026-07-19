import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
 Button,
 Input,
 Modal,
 Toast,
 Loader
} from "../components/ui";

function ComponentsDemo({ darkMode, setDarkMode }) {
 return (
  <>
   <Navbar
    darkMode={darkMode}
    setDarkMode={setDarkMode}
   />

   <div style={{ padding: "30px" }}>
    <h1>UI Component Library</h1>
    <p>
  This page demonstrates all reusable UI components used in Homestay Intelligence Platform.
</p>
    <Button text="Click Me" />

    <br /><br />

    <Input
      type="text"
      placeholder="Enter Review"
    />

    <br /><br />

    <Loader />

    <br /><br />

    <Toast message="Review Submitted" />

    <br /><br />

    <Modal isOpen={true}>
      Demo Modal
    </Modal>
   </div>

   <Footer darkMode={darkMode} />
  </>
 );
}

export default ComponentsDemo;