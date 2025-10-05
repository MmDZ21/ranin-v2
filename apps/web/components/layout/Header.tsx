import React from "react";
import NavBar from "./Navbar";
import { NAVBAR_CONFIG } from "@/constants";


export default function Header() {
  return <><NavBar {...NAVBAR_CONFIG} /></>;
}
