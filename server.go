package main

import (
	"time"

	"github.com/gin-gonic/gin"
)

func main() {

	r := gin.Default()
	r.Static("/static", ".")

	r.GET("/stream", func(c *gin.Context) {
		c.Writer.Write([]byte(`
			<div>
				<h1>First streaming part</h1>
			</div>
		`))
		c.Writer.Flush()
		<-time.After(300 * time.Millisecond)

		c.Writer.Write([]byte(`
			<div>
				<h1>Second streaming part</h1>
			</div>
		`))
		c.Writer.Flush()
		<-time.After(300 * time.Millisecond)

		c.Writer.Write([]byte(`
		  <form hx-swap="outerHTML" hx-ext="stream" hx-get="/stream">
			<h1> final part </h1>
			<button>do it again</button>
		  </form>
		`))
		c.Writer.Flush()
	})

	r.GET("/page1", func(c *gin.Context) {
		c.Writer.Write([]byte(`
			<div>
				loading page...

			</div>
		`))
		c.Writer.Flush()
		<-time.After(300 * time.Millisecond)

		c.Writer.Write([]byte(`
			<div>
				<h1>Page 1</h1>
				<p>Some text</p>
			</div>
		`))
		c.Writer.Flush()
		<-time.After(300 * time.Millisecond)

		c.Writer.Write([]byte(`
			<div>
				<h1>Page 1</h1>
				<p>Some text</p>
				<p>Some other text</p>
				<a href="/static/">return</a>
			</div>
		`))
		c.Writer.Flush()
		<-time.After(300 * time.Millisecond)
	})

	r.Run(":3000")
}
