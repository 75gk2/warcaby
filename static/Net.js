class Net {
    constructor() {
    }

    send(addr, data, next) {
        fetch(addr, { method: 'POST', body: JSON.stringify(data), headers: { "Content-Type": 'application/json' } })
            .then(response => response.json())
            .then(data => next(data))
            .catch(error => {
                if (error.message === "Unexpected end of JSON input")
                    console.log("server ended on " + addr)
                else
                    console.error(error)
            })
    }

    interval(addr, data, next) {
        const interval = setInterval(() => {
            this.send(addr, data, (res) => {
                clearInterval(interval)
                next(res)
            })
        }, 500)

    }
}

