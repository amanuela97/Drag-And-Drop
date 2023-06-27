import { useState, useRef } from 'react'

let isCounting = false
let totalSeconds = 0
function App() {
  const list = Array.from({ length: 10 }, (_, i) => i + 1)
  const [items, setItems] = useState(list)
  const [isPlaying, setIsPlaying] = useState(false)
  const secondsLabel = useRef(0)
  const minutesLabel = useRef(0)

  isCounting = isPlaying
  const count = () => {
    const id = setInterval(() => {
      if (!isCounting) {
        return clearInterval(id)
      }
      ++totalSeconds
      secondsLabel.current.innerHTML = pad(totalSeconds % 60)
      minutesLabel.current.innerHTML = pad(parseInt(totalSeconds / 60))
    }, 1000)
  }

  const pad = (val) => {
    var valString = val + ''
    if (valString.length < 2) {
      return '0' + valString
    } else {
      return valString
    }
  }

  const start = () => {
    setIsPlaying(true)
    count()
    const newList = [...items].sort((_) => 0.5 - Math.random())
    setItems(newList)
  }

  const reStart = () => {
    setIsPlaying(false)
    totalSeconds = 0
    secondsLabel.current.innerHTML = '00'
    minutesLabel.current.innerHTML = '00'
    window.location = '/'
  }

  const dropHandler = (e) => {
    e.preventDefault()
    const listToCheck = Array.from(
      document.getElementsByTagName('ul')[0].getElementsByTagName('li')
    ).map((x) => parseInt(x.innerText))

    const isOrdered = listToCheck.every((x, i) => {
      return i === 0 || x >= listToCheck[i - 1]
    })

    if (isOrdered) {
      setIsPlaying(false)
      totalSeconds = 0
    }
  }

  const dragHandler = (e) => {
    e.preventDefault()
    const selectedItem = e.target
    const list = selectedItem.parentNode
    const x = e.clientX
    const y = e.clientY

    let swapItem =
      document.elementFromPoint(x, y) === null
        ? selectedItem
        : document.elementFromPoint(x, y)

    if (list === swapItem.parentNode) {
      swapItem =
        swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling
      list.insertBefore(selectedItem, swapItem)
    }
  }

  return (
    <div className="bg-gray-500 w-screen h-screen flex flex-col items-center">
      <div className="flex items-center justify-center p-4 mt-4 space-x-4">
        {!isPlaying ? (
          <button
            onClick={start}
            className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-full tracking-wide text-lg px-5 py-2.5 text-center "
          >
            Start
          </button>
        ) : (
          <button
            onClick={reStart}
            className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-full tracking-wide text-lg px-5 py-2.5 text-center "
          >
            Restart
          </button>
        )}
        <div className="text-white text-lg">
          <label ref={minutesLabel}>00</label>:
          <label ref={secondsLabel}>00</label>
        </div>
      </div>
      <ul className="bg-cyan-500 w-fit h-fit p-6 space-y-6 mt-4">
        {items.map((item, index) => (
          <li
            id={item}
            draggable={isPlaying}
            onDrag={dragHandler}
            onDragEnd={dropHandler}
            key={index}
            className="active:bg-orange-400 text-xl w-24 border-2 font-bold cursor-pointer text-center bg-orange-500"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
