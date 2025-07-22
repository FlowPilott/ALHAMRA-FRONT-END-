"use client"

import { useEffect, useRef, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { logout } from "../redux/slices/authSlice"
import { useAppDispatch } from "../hooks/hooks"
import { setTitle } from "../redux/slices/titleSlice"
import { logOut } from "../api/modules/Swiftsync.class"
import { fetchActiveTasksCount, selectActiveCount } from "../redux/slices/taskSlice"



import interaction from "../../public/images/interaction.svg"
import task from "../../public/images/task.svg"
import report from "../../public/images/report.svg"
import LogOutIcon from "../../public/images/logout.svg"

const navItems = [
  { title: "Interaction Form", path: "/Interaction/form", icon: interaction },
  {
    title: "Task Management",
    path: "/TaskManagement",
    icon: task,
    badge: true,
  },
  { title: "Reports", path: "/reports", icon: report },
  { title: "Contractor List", path: "/contractorList", icon: report },
  { title: "Contact Us", path: "/ticket", icon: report },
]

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const count = useSelector(selectActiveCount)
  const refresh = useSelector((state: any) => state.auth.refresh)

  const sidebarRef = useRef(null)
  const triggerRef = useRef(null)

  const [sidebarExpanded, setSidebarExpanded] = useState(localStorage.getItem("sidebar-expanded") === "true")

  const handleLogOut = () => {
    logOut({ refresh })
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem('user-id')
    dispatch(logout())
    navigate("/signin")
  }

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) {
        setSidebarOpen(false)
      }
    }
    document.addEventListener("click", clickHandler)
    return () => document.removeEventListener("click", clickHandler)
  }, [sidebarOpen])

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (sidebarOpen && e.key === "Escape") setSidebarOpen(false)
    }
    document.addEventListener("keydown", keyHandler)
    return () => document.removeEventListener("keydown", keyHandler)
  }, [sidebarOpen])

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString())
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded)
  }, [sidebarExpanded])

  return (
    <aside
      ref={sidebarRef}
      className={`absolute left-0 top-0 z-9999 flex h-screen flex-col bg-[#1C1C1C] duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "w-[264px]" : "w-[64px]"
      }`}
    >
      {/* Toggle button */}
      <div
        ref={triggerRef}
        className="bg-gray-800 absolute right-[-12px] top-6 z-50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg className="h-6 w-6" viewBox="0 0 22 22" fill="black">
          <circle cx="11" cy="11" r="10" stroke="white" strokeWidth="2" />
          <path
            d="M9.25 12.75H7.5c-.165 0-.303-.056-.415-.168A.583.583 0 0 1 6.92 12.17c0-.165.056-.303.168-.415a.583.583 0 0 1 .415-.168h2.33c.165 0 .303.056.415.168.112.112.168.25.168.415v2.33c0 .165-.056.303-.168.415a.583.583 0 0 1-.415.168.583.583 0 0 1-.415-.168.583.583 0 0 1-.168-.415V12.75zm3.5-3.5H14.5c.165 0 .303.056.415.168.112.112.168.25.168.415 0 .165-.056.303-.168.415a.583.583 0 0 1-.415.168H12.17a.583.583 0 0 1-.415-.168.583.583 0 0 1-.168-.415V7.5c0-.165.056-.303.168-.415a.583.583 0 0 1 .415-.168c.165 0 .303.056.415.168.112.112.168.25.168.415v1.75z"
            fill="white"
          />
        </svg>
      </div>

      {/* Logo */}
      <div className="p-6 text-center">
        <NavLink to="/"></NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="flex flex-col gap-1.5">
          {navItems.map(({ title, path, icon, badge }) => (
            <li
    key={title}
    onClick={() => {
      dispatch(setTitle(title));
      if (badge) {
        dispatch(fetchActiveTasksCount()); // or any function you want
      }
    }}
  >              <NavLink
                to={path}
                className={({ isActive }) =>
                  `group relative flex items-center ${
                    sidebarOpen ? "gap-4" : "gap-2"
                  } p-2 text-sm font-normal duration-100 ease-in-out ${
                    isActive ? "bg-[#4e4b4b] text-white" : "text-[#ECE9E9]"
                  }`
                }
                
              >
                <img src={icon || "/placeholder.svg"} alt="" className="h-5 w-5 shrink-0" />
                <span className={`transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "w-0 opacity-0"}`}>
                  {title}
                </span>
                {badge && (
                  <span
                    className={`${
                      sidebarOpen
                        ? "ml-auto rounded-full bg-[#B2282F] px-2 py-1 text-xs text-white"
                        : "absolute right-0 top-1 -translate-y-1/2 transform rounded-full bg-[#B2282F] px-2 py-0.5 text-[10px] text-white"
                    }`}
                  >
                    {count}
                  </span>
                )}

                {/* Tooltip - only visible when sidebar is collapsed */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 hidden whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:block group-hover:opacity-100">
                    {title}
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <div
          className="absolute bottom-6 flex w-[80%] cursor-pointer justify-center bg-[#1C1C1C] p-3 text-center"
          onClick={handleLogOut}
        >
          <button className="group relative flex items-center gap-4 text-sm text-white">
            <img src={LogOutIcon || "/placeholder.svg"} alt="logout" />
            <span className={`transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "w-0 opacity-0"}`}>
              Logout
            </span>

            {/* Logout tooltip */}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 hidden whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:block group-hover:opacity-100">
                Logout
              </div>
            )}
          </button>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
