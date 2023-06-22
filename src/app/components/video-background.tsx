"use client";

import { useState, useRef, useEffect, LegacyRef } from "react";
import Image from "next/image";

const VideoBg = ({
  src,
  videoComponent,
}: {
  src: string;
  videoComponent: LegacyRef<HTMLVideoElement>;
}) => {
  return (
    <video
      className="h-screen w-auto sm:w-screen"
      autoPlay
      loop
      muted
      ref={videoComponent}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};

export default function VideoBackground() {
  const delay = 1000;
  const [current, setCurrent] = useState(0);
  const [init, setInit] = useState(false);

  const banners = [
    {
      videoSrc: "./banner01.mp4",
      slogan: (
        <span>
          Como anda a <br /> sua{" "}
          <strong className="text-sky-500">saúde mental</strong>?
        </span>
      ),
      videoComponent: useRef<HTMLVideoElement>(null),
      duration: 0,
    },
    {
      videoSrc: "./banner02.mp4",
      slogan: (
        <span>
          De <strong className="text-sky-500">onde</strong> estiver <br /> e a
          qualquer <strong className="text-sky-500">momento</strong>
        </span>
      ),
      videoComponent: useRef<HTMLVideoElement>(null),
      duration: 0,
    },
    {
      videoSrc: "./banner03.mp4",
      slogan: (
        <span>
          Atendimento em <br /> todo{" "}
          <strong className="text-sky-500">Brasil</strong>
        </span>
      ),
      videoComponent: useRef<HTMLVideoElement>(null),
      duration: 0,
    },
    {
      videoSrc: "./banner04.mp4",
      slogan: (
        <span>
          Receita médica de{" "}
          <strong className="text-sky-500">forma digital</strong> <br /> ou na{" "}
          <strong className="text-sky-500">sua casa</strong>
        </span>
      ),
      videoComponent: useRef<HTMLVideoElement>(null),
      duration: 0,
    },
  ];

  const getOverflow = (i: number) => {
    return i === current ? "opacity-100" : "opacity-0";
  };

  const nextWaitBanner = (index: number) => {
    const interval = setInterval(() => {
      const currentBanner = banners[index].videoComponent.current!;
      if (currentBanner.currentTime + delay / 1000 >= currentBanner.duration) {
        nextBanner();
        setInit(true);
        clearInterval(interval);
      }
    }, 10);
  };

  const nextBanner = () => {
    backwardAllVideosExcept(current);
    if (current === banners.length - 1) {
      setCurrent(0);
    } else {
      setCurrent(current + 1);
    }
  };

  const prevBanner = () => {
    backwardAllVideosExcept(current);
    if (current === 0) {
      setCurrent(banners.length - 1);
    } else {
      setCurrent(current - 1);
    }
  };

  const setBanner = (i: number) => {
    backwardAllVideosExcept(current);
    setCurrent(i);
  };

  const backwardAllVideosExcept = (i: number) => {
    banners
      .filter((b, i) => i !== current)
      .forEach((banner) => {
        if (banner.videoComponent.current)
          banner.videoComponent.current.currentTime = 0;
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      banners.forEach((banner) => {
        if (banner.videoComponent.current) {
          if (banner.videoComponent.current.readyState > 0) {
            banner.duration = banner.videoComponent.current.duration;
          }
        }
      });
      if (banners.every((banner) => banner.duration > 0)) {
        clearInterval(interval);
        nextWaitBanner(current);
      }
    }, 10);
  }, []);

  useEffect(() => {
    if (init) {
      nextWaitBanner(current);
    }
  }, [current, init]);

  return (
    <div className="h-screen w-screen absolute overflow-hidden">
      {banners.map((banner, i) => (
        <div
          className={
            "h-screen w-screen absolute transition duration-1000 " +
            getOverflow(i)
          }
          key={banner.videoSrc}
        >
          <div className="h-screen w-screen absolute z-10 flex">
            <div className="absolute h-screen w-screen bg-gradient-to-b from-slate-900 to-slate-500 from-10% opacity-75"></div>
            <div className="w-screen h-screen overflow-hidden">
              <div
                className="ml-[-50vh] sm:ml-0 w-[200vh] sm:w-screen"
              >
                <VideoBg
                  src={banner.videoSrc}
                  videoComponent={banner.videoComponent}
                />
              </div>
            </div>
          </div>
          <div className="h-screen w-screen absolute overflow-hidden z-20 flex justify-between flex-col">
            <div className="nav h-20"></div>
            <div className="container m-auto text-center text-4xl sm:text-6xl text-white">
              <div className="flex justify-between items-center gap-x-10 px-5">
                <div className="prev">
                  <a href="#prev" onClick={prevBanner}>
                    <Image
                      src="./nav.svg"
                      width={24}
                      height={42}
                      alt="Anterior"
                      className="max-w-auto"
                    />
                  </a>
                </div>
                <div className="slogan">{banner.slogan} </div>
                <div className="next">
                  <a href="#next" onClick={nextBanner}>
                    <Image
                      src={"./nav.svg"}
                      width={24}
                      height={42}
                      alt="Próximo"
                      className="max-w-auto"
                      style={{ transform: "scaleX(-1)" }}
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="bullets">
              <div className="flex flex-row justify-center p-4">
                {banners.map((b, y) => (
                  <a
                    href="#goto"
                    onClick={() => setBanner(y)}
                    className={
                      "rounded-full border border-white w-3 h-3 m-1 " +
                      (y === current ? "bg-white" : "")
                    }
                    key={y}
                  ></a>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
