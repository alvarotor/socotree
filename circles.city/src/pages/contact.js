import React, { useState } from "react"
import { navigate } from "gatsby-link"

import Layout from "../components/layout"
import SEO from "../components/seo"

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

const Contact = () => {
  const [contact, setContact] = useState({})

  var style = {
    marginTop: 50,
  }

  var field = {
    marginTop: 10,
  }

  var boxes = {
    display: "block",
    width: "100%",
    padding: ".375rem .75rem",
    fontSize: "1rem",
    lineHeight: 1.5,
    color: "#495057",
    backgroundColor: "#fff",
    backgroundClip: "padding-box",
    border: "1px solid #ced4da",
    borderRadius: ".25rem",
    transition: "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
  }

  var button = {
    color: "#fff",
    backgroundColor: "#007bff",
    borderColor: "#007bff",
    display: "inline-block",
    fontWeight: "400",
    textAlign: "center",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    userSelect: "none",
    border: "1px solid transparent",
    padding: ".375rem .75rem",
    fontSize: "1rem",
    lineHeight: "1.5",
    borderRadius: ".25rem",
    transition:
      "color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out",
  }

  const handleChange = e => {
    setContact({ ...contact, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    const form = e.target
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": form.getAttribute("name"),
        ...contact,
      }),
    })
      .then(() => navigate(form.getAttribute("action")))
      .catch(error => alert(error))
  }

  return (
    <Layout train="remove">
      <SEO title="Contact Us" />
      <section className="section">
        <div className="container">
          <div className="content">
            <h1 style={style}>Contact Us</h1>
            <form
              name="contact"
              method="post"
              action="/thanks/"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
            >
              {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
              <input type="hidden" name="form-name" value="contact" />
              <div hidden>
                <label>
                  Don’t fill this out:{" "}
                  <input name="bot-field" onChange={handleChange} />
                </label>
              </div>
              <div style={field}>
                <label className="label" htmlFor={"name"}>
                  Your name
                </label>
                <div className="control">
                  <input
                    style={boxes}
                    type={"text"}
                    name={"name"}
                    onChange={handleChange}
                    id={"name"}
                    required={true}
                  />
                </div>
              </div>
              <div style={field}>
                <label className="label" htmlFor={"email"}>
                  Email
                </label>
                <div className="control">
                  <input
                    style={boxes}
                    type={"email"}
                    name={"email"}
                    onChange={handleChange}
                    id={"email"}
                    required={true}
                  />
                </div>
              </div>
              <div style={field}>
                <label className="label" htmlFor={"message"}>
                  Message
                </label>
                <div className="control">
                  <textarea
                    style={boxes}
                    name={"message"}
                    onChange={handleChange}
                    id={"message"}
                    required={true}
                  />
                </div>
              </div>
              <div style={field}>
                <button style={button} type="submit">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Contact
