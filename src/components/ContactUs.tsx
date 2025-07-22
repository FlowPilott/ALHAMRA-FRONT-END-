"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import Toaster from "./Toast/Toast"
import { ticket } from "../api/modules/Swiftsync.class"
import Spinner from "../common/Spinner"

interface Message {
  success?: string
  error?: string
}

interface FormData {
  name: string
  subject: string
  issue: string
  image?: File | null
  email: string
}

const ContactUs = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<Message>({})
  const [formData, setFormData] = useState<FormData>({
    name: "",
    subject: "",
    issue: "",
    image: null,
    email:'',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {

      setFormData((prevState) => ({
        ...prevState,
        file: e.target.files?.[0] || null,
      }))
    }
  }

  const handleRemoveFile = () => {
    setFormData((prevState) => ({
      ...prevState,
      file: null,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const email = localStorage?.getItem("email") || "default@example.com"

    try {
      // You may need to update the ticket function to handle file uploads
      await ticket(email, formData)
      setMessage({ success: "Your message has been sent successfully!" })
      setFormData({
        name: "",
        subject: "",
        issue: "",
        image: null,
        email: '',
      })
    } catch (error) {
      setMessage({ error: "Failed to send your message. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Toaster message={message} />
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Open A Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="subject" className="mb-1 block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="issue" className="mb-1 block text-sm font-medium text-gray-700">
              Issue
            </label>
            <textarea
              id="issue"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">Attachment</label>
            {formData.file ? (
              <div className="flex items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
                <span className="truncate text-sm text-gray-700">{formData.file.name}</span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-2 rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  aria-label="Upload file"
                />
                <div className="flex w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 py-3 px-4 text-sm text-gray-500 hover:bg-gray-100">
                  <span>Click to upload a file</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[#B2282F] px-4 py-2 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? <Spinner /> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactUs

