class Ui {
    constructor() {
        const login = document.getElementById("login")
        const reset = document.getElementById("reset")
        const input = document.getElementById("name")
        const form = document.getElementById("loginForm")
        const clock = document.getElementById("clock")
        const info = document.getElementById("info")
        const info2 = document.getElementById("info2")

        reset.addEventListener("click", () => net.send('/RESET', {}, () => { }))
        login.addEventListener("click", function () {
            game.name = input.value
            this.name = input.value
            let res = net.send('/ADD_USER', { login: this.name }, (data) => {
                if (data) {
                    form.innerHTML = `<h1>Czekanie na drugiego gracza</h1>`

                    net.interval("/WAITING/" + this.name, {}, (data) => {
                        info2.innerText = `grasz z ${data.opponent}`
                        form.style.display = "none"
                        game.myColor = data.color
                        game.start()
                    })
                }
            })
        })

        input.value = "user"+Math.round(Math.random()*100)
        let time = 30
        function displayTime(){
            if(time === 0 ) {
                clearInterval(interval)
                interval = null
                alert("czas minął")
            }
            clock.innerText = time
            --time
        }

        let interval = null
        function setClock(){
            time = 30
            if(interval==null)
                interval = setInterval(displayTime,1000)
        }

        this.onMove = ()=>{
            if(game.status === "moving")
                info.innerText = "Twój ruch"
            else
                info.innerText = "Ruch przeciwnika"
            setClock()
        }
    }
}