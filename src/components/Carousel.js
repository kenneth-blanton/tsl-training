import { useState, useEffect } from "react";

const Carousel = (props) => {
  const [current, setCurrent] = useState(0);
  const selected = props.id;

  var myopacity = 0;

  function MyFadeFunction() {
    if (myopacity < 1) {
      myopacity += 0.05;
      setTimeout(function () {
        MyFadeFunction();
      }, 10);
    }
    document.getElementById("carouselInner").style.opacity = myopacity;
  }

  useEffect(() => {
    setCurrent(0);
    MyFadeFunction();
  }, [selected]);

  const decrement = () => {
    if (current === 0) {
      setCurrent(selected[0].images.length - 1);
    } else {
      setCurrent(current - 1);
    }
    MyFadeFunction();
  };

  const increment = () => {
    if (current === selected[0].images.length - 1) {
      setCurrent(0);
    } else {
      setCurrent(current + 1);
    }
    MyFadeFunction();
  };

  return (
    <div className="carousel">
      <div className="carouselInner" id="carouselInner">
        <img
          id="infoPic"
          src={selected[0].images[current]}
          alt={selected[0].images[current]}
        />
        <p>{selected[0].captions[current]}</p>
      </div>
      <button id="prev" onClick={decrement}>
        &#10094;
      </button>
      <button id="next" onClick={increment}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
