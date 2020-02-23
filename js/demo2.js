const s = (p) => {
  let demo2Shader, img, d_map, fft, audio, toggleBtn

  p.preload = () => {
    //audio         = p.loadSound('audio/d18_3.mp3');
    audio         = p.loadSound('audio/demo2.mp3')
    demo2Shader   = p.loadShader('shaders/base.vert', 'shaders/d2.frag')
    img           = p.loadImage('img/2.jpg')
    d_map         = p.loadImage('img/clouds.jpg')
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
      p.shader(demo2Shader)
      demo2Shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight])
      demo2Shader.setUniform('d_map', d_map)
      demo2Shader.setUniform('img', img)
      demo2Shader.setUniform('texRes', [img.width, img.height])
  }

  p.draw = () => {
    p.background(0)

    fft.analyze()

    const bass    = fft.getEnergy("bass")
    const treble  = fft.getEnergy("treble")
    const mid     = fft.getEnergy("highMid")
    const lowMid  = fft.getEnergy("mid")

    const mapBass = p.map(bass, 0, 255, 0.0, 0.04)
    const mapMid  = p.map(mid, 0, 30, 0.0, 0.8)
    const mapLowMid  = p.map(lowMid, 0, 60, 0.0, 0.4)

    const tc = p.map(audio.currentTime(), 0, audio.duration(), 1.0, 1.0)
    demo2Shader.setUniform('u_time', tc)
    demo2Shader.setUniform('u_bass', mapBass)
    demo2Shader.setUniform('u_mid', mapMid)
    demo2Shader.setUniform('u_lowmid', mapLowMid)

    p.rect(0, 0 , p.width, p.height)
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    demo2Shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight])
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