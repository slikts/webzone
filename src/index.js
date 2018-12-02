import { Cycle } from "circulator"
import { css } from "emotion"
import { html, render } from "lit-html"
import "../static/main.css"
import MirrorWord from "./components/MirrorWord"
import { animateLetter, hideLetter } from "./animate"
import { cursor } from "./components/Mouse"
import "@babel/polyfill"
import config from "./config"
import { play, of } from "./util"
import "./scroll"

const root = document.querySelector(`#Animation-root`)

render(
  html`<div class="Animation ${css`
    flex-grow: 1;
  `}">
  ${config.texts.map(MirrorWord)}
</div>
`,
  root,
)

const setup = word => {
  const letters = [
    ...word.querySelectorAll(`.Word-mirror-false .Letter`),
  ]
  const mirrors = [
    ...word.querySelectorAll(`.Word-mirror-true .Letter`),
  ]

  const animation = Animation[of](
    new GroupEffect(
      letters
        .map(
          letter =>
            new SequenceEffect(
              [animateLetter(letter)].concat(
                config.hide ? hideLetter(letter) : [],
              ),
            ),
        )
        .concat(
          config.mirror
            ? mirrors.map(
                letter =>
                  new SequenceEffect(
                    [animateLetter(letter, true)].concat(
                      config.hide ? hideLetter(letter, true) : [],
                    ),
                  ),
              )
            : [],
        ),
    ),
  )

  return {
    word,
    letters,
    animation,
  }
}

const words = [...document.querySelectorAll(`.MirrorWord`)]
const circularWords = Cycle(words.map(setup))

words.forEach(word => {
  word.style.display = `none`
  word.style.position = `relative`
})

void (async () => {
  for (const { animation, word } of circularWords) {
    word.style.display = `block`
    window.playing = animation
    await animation[play]()
    window.playing = null
    word.style.display = `none`
    if (!config.loop) {
      break
    }
  }
})()

document.documentElement.classList.add(css`
  cursor: url(${cursor()}) 5 5, default;
`)
