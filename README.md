# htmx-stream

An htmx extension for streaming contents using http streaming

## installation

1. Copy all contents from index.js
2. Paste them into a script after the htmx initialization.
3. Profit


## usage

On the client:

```html
<form hx-ext="stream" hx-get="/stream">
  <button>stream changes</button>
</form>
```

On the server:

```go
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
		  <form hx-get="http://localhost:8080/">
			<h1> final part </h1>
			<button>do it again</button>
		  </form>
		`))
		c.Writer.Flush()
	})
```


The extension will overwrite the previous contents of the target with the new streamed html. 

# Limitations

hx-target is not supported
