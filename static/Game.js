class Game {
    constructor() {
        this.myColor = 0

        this.clickedPion = null

        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2()

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(0, 100, 100)
        this.camera.lookAt(this.scene.position)
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x444444);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        const axes = new THREE.AxesHelper(1000)
        // this.scene.add(axes)
        document.getElementById("root").append(this.renderer.domElement);


        this.render()
        this.szachownica = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],

        ];
        this.szachownicaDefault = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],]

        this.pionki = [

            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],

        ];
        this.pionyTHREE = []
        this.plansza()
        this.pionki2()
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
    }


    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
    }

    planszaTHREE = []
    plansza = () => {
        this.planszaTHREE.forEach((e) => {
            this.scene.remove(e)

        })
        this.planszaTHREE = []
        console.log(this.szachownica)

        const white = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("img/whiteField.jpg"),
        })

        const dark = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("img/blackField3.jpg"),
        })

        const highlighted = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("img/redWood.jpg"),
        })

        const geometry = new THREE.PlaneGeometry(10, 10)
        for (let j = 0; j < 8; j++)
            for (let i = 0; i < 8; i++) {
                const field = new THREE.Mesh(geometry, this.szachownica[i][j] >= 1 ? white : dark)
                if (this.szachownica[i][j] === 100)
                    field.material = highlighted
                field.position.set(j * 10 - 35, 0, i * 10 - 35)
                field.data = {x: i, y: j}
                field.rotation.x = Math.PI / 2
                this.scene.add(field)
                this.planszaTHREE.push(field)
            }
    }
    pionki2 = () => {
        this.pionyTHREE.forEach((p) => {
            this.scene.remove(p)
        })

        this.pionyTHREE = []

        const white = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("img/whiteWood.jpg"),
        })

        const dark = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("img/blackWood.jpg"),
        })

        const geometry = new THREE.CylinderGeometry(4, 4, 2, 36)
        for (let j = 0; j < 8; j++)
            for (let i = 0; i < 8; i++) {
                if (this.pionki[i][j] == 0)
                    continue
                const color = this.pionki[i][j]
                const pion = new THREE.Mesh(geometry, color == 1 ? white : dark)
                pion.position.set(j * 10 - 35, 2, i * 10 - 35)
                pion.data = {x: i, y: j, color: color}
                this.scene.add(pion)
                this.pionyTHREE.push(pion)
            }
    }

    move = () => {
        function clicked(event) {
            game.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            game.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
            game.raycaster.setFromCamera(game.mouseVector, game.camera);
            const intersects = game.raycaster.intersectObjects(game.scene.children);
            if (intersects.length > 0) {
                window.removeEventListener('mousedown', clicked)
                game.moving(intersects[0].object)
            }
        }

        window.addEventListener("mousedown", clicked);
    }

    moving = (obj) => {

        //pionek
        if (this.pionyTHREE.includes(obj)) {
            //swój
            if (obj.data.color === this.myColor) {
                obj.material = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    map: new THREE.TextureLoader().load("img/redWood.jpg"),
                })
                this.clickedPion = obj.data
                this.showValidFields(obj.data, this.pionki)
            }
            this.move()
        } else {
            //pole płaskie
            //kliknięty, da się stanąć
            if (this.clickedPion !== null && this.szachownica[obj.data.x][obj.data.y] === 100) {
                // ruszanie

                this.pionki[this.clickedPion.x][this.clickedPion.y] = 0
                this.pionki[obj.data.x][obj.data.y] = this.clickedPion.color

                //pola różne od 2 - bicie
                if (Math.abs(this.clickedPion.x - obj.data.x) === 2)
                    this.pionki[(this.clickedPion.x + obj.data.x) / 2][(this.clickedPion.y + obj.data.y) / 2] = 0

                const animation = {
                    start: this.clickedPion,
                    end: obj.data
                }
                this.moved(animation)
                this.clickedPion = null
                this.szachownica = JSON.parse(JSON.stringify(this.szachownicaDefault))
                this.plansza()

                game.animation(animation, () => {
                    this.pionki2()
                })
            } else
                // czekaj dalej
                this.move()
        }
    }

    showValidFields(cords, positions) {
        this.szachownica = JSON.parse(JSON.stringify(this.szachownicaDefault))

        const color = this.myColor
        const colorOp = color === 1 ? 2 : 1
        const side = color === 2 ? 1 : -1
        if (this.markXY(positions, colorOp, cords.x + side, cords.y + 1))
            this.markXY(positions, colorOp, cords.x + 2 * side, cords.y + 2)
        if (this.markXY(positions, colorOp, cords.x + side, cords.y - 1))
            this.markXY(positions, colorOp, cords.x + 2 * side, cords.y - 2)
        this.plansza()
    }

    markXY(positions, colorOp, x, y) {
        console.log(positions[x][y], colorOp)
        if (x < 0 && x > 9 && y < 0 && y > 9)
            return false
        if (positions[x][y] === 0) {
            this.szachownica[x][y] = 100
            return false
        } else if (positions[x][y] === colorOp)
            return true
    }

    animation = (animation, next) => {
        console.log(animation)
        let left = 60

        const PION = this.pionyTHREE.filter((e) => {
            console.log(e.data, animation.start)
            if (e.data.x === animation.start.x && e.data.y === animation.start.y)
                return e
        })[0]
        const interval = setInterval(() => {
                PION.position.z += (animation.end.x - animation.start.x) / 6
                PION.position.x += (animation.end.y - animation.start.y) / 6
                left--
                console.log(PION.position.x)
                if (left === 0) {
                    clearInterval(interval)
                    next()
                }
            }
            , 1000 / 60)
    }
    moved = (animation) => {
        net.send("/moved", {name: game.name, animation: animation, board: this.pionki}, (data) => {
            if (data.status === 200) {
                game.status = "waiting"
                ui.onMove()
                this.isMyTurn()
            }
        })
    }

    isMyTurn = () => {
        net.interval("/isMyTurn", {name: game.name}, (data) => {
            game.animation(data.animation, () => {
                game.status = "moving"
                ui.onMove()
                game.pionki = data.board
                game.pionki2()
                game.move()
            })
        })
    }
    start = () => {
        if (this.myColor === 2) {
            game.status = "waiting"
            ui.onMove()
            this.camera.position.set(0, 100, -100)
            this.camera.lookAt(this.scene.position)
            this.isMyTurn()
        } else {
            game.status = "moving"
            ui.onMove()
            this.move()
        }
    }

}