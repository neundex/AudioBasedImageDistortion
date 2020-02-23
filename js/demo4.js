const s = (p) => {
  let demo4Shader, img, d_map, fft, audio, toggleBtn

  p.preload = () => {
    audio = p.loadSound('audio/demo4.mp3')
    demo4Shader = p.loadShader('shaders/base.vert', 'shaders/d4.frag')
    img = p.loadImage('img/4.jpg')
    d_map = p.loadImage('img/clouds.jpg')
  }

  p.setup = () => {
      playBtn = document.querySelector('#play-btn')
      playBtn.addEventListener('click', () => {
        document.body.classList.add('start-anim')
        audio.loop()
      })

      p.pixelDensity(1)
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)

      toggleBtn = document.querySelector('#toggle-btn')
      toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('toggle--on')
        this.toggleAudio()
      })

      fft = new p5.FFT()
      p.shader(demo4Shader)
      demo4Shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight])
      demo4Shader.setUniform('d_map', d_map)
      demo4Shader.setUniform('img', img)
      demo4Shader.setUniform('u_tResolution', [img.width, img.height])
  }

  p.draw = () => {
    p.background(0)

    fft.analyze()

    const bass    = fft.getEnergy("bass")
    const treble  = fft.getEnergy("treble")
    const mid     = fft.getEnergy("mid")

    const mapBass     = p.map(bass, 0, 255, 0, 0.02)
    const mapMid     = p.map(mid, 0, 70, 0, 10.001)

    // let fc = p.map(p.frameCount, 0, 1000, 0.0, 2.5)
    const tc = p.map(audio.currentTime(), 0, audio.duration(), 2.0, 2.0)
    demo4Shader.setUniform('u_time', tc)
    demo4Shader.setUniform('u_bass', mapBass)
    demo4Shader.setUniform('u_mid', mapMid)

    p.rect(0, 0 , p.width, p.height)
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    demo4Shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight])
  }

  toggleAudio = () => {
    if (audio.isPlaying()) {
      audio.pause()
    } else {
      audio.loop()
    }
  }
};

new p5(s)