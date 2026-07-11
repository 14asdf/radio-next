'use client';

import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';

const TAU = Math.PI * 2;
const rand = (n) => Math.random() * n;
const fadeInOut = (t, m) => {
  const hm = 0.5 * m;
  return Math.abs(((t + hm) % m) - hm) / hm;
};

export default function AnimatedBackground() {
  const containerRef = useRef(null);
  const tickerRef = useRef(null);

  useEffect(() => {
    const circleCount = 150;
    const circlePropCount = 8;
    const circlePropsLength = circleCount * circlePropCount;
    const baseSpeed = 0.1;
    const rangeSpeed = 1;
    const baseTTL = 150;
    const rangeTTL = 200;
    const baseRadius = 100;
    const rangeRadius = 200;
    const rangeHue = 60;
    const xOff = 0.0015;
    const yOff = 0.0015;
    const zOff = 0.0015;

    let canvas, ctx, circleProps, noise3D, baseHue;

    function initCircles() {
      circleProps = new Float32Array(circlePropsLength);
      noise3D = createNoise3D();
      baseHue = 220;

      for (let i = 0; i < circlePropsLength; i += circlePropCount) {
        initCircle(i);
      }
    }

    function initCircle(i) {
      const x = rand(canvas.a.width);
      const y = rand(canvas.a.height);
      const n = noise3D(x * xOff, y * yOff, baseHue * zOff);
      const t = rand(TAU);
      const speed = baseSpeed + rand(rangeSpeed);
      const vx = speed * Math.cos(t);
      const vy = speed * Math.sin(t);
      const life = 0;
      const ttl = baseTTL + rand(rangeTTL);
      const radius = baseRadius + rand(rangeRadius);
      const hue = baseHue + n * rangeHue;

      circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
    }

    function updateCircles() {
      baseHue++;

      for (let i = 0; i < circlePropsLength; i += circlePropCount) {
        updateCircle(i);
      }
    }

    function updateCircle(i) {
      const i2 = 1 + i;
      const i3 = 2 + i;
      const i4 = 3 + i;
      const i5 = 4 + i;
      const i6 = 5 + i;
      const i7 = 6 + i;
      const i8 = 7 + i;

      const x = circleProps[i];
      const y = circleProps[i2];
      const vx = circleProps[i3];
      const vy = circleProps[i4];
      let life = circleProps[i5];
      const ttl = circleProps[i6];
      const radius = circleProps[i7];
      const hue = circleProps[i8];

      drawCircle(x, y, life, ttl, radius, hue);

      life++;

      circleProps[i] = x + vx;
      circleProps[i2] = y + vy;
      circleProps[i5] = life;

      if (checkBounds(x, y, radius) || life > ttl) initCircle(i);
    }

    function drawCircle(x, y, life, ttl, radius, hue) {
      ctx.a.save();
      ctx.a.fillStyle = `hsla(${hue},60%,30%,${fadeInOut(life, ttl)})`;
      ctx.a.beginPath();
      ctx.a.arc(x, y, radius, 0, TAU);
      ctx.a.fill();
      ctx.a.closePath();
      ctx.a.restore();
    }

    function checkBounds(x, y, radius) {
      return (
        x < -radius || x > canvas.a.width + radius || y < -radius || y > canvas.a.height + radius
      );
    }

    function createCanvas() {
      canvas = {
        a: document.createElement('canvas'),
      };

      canvas.a.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
      `;

      const blurOverlay = document.createElement('div');
      blurOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        backdrop-filter: blur(50px);
        -webkit-backdrop-filter: blur(50px);
      `;

      containerRef.current.appendChild(canvas.a);
      containerRef.current.appendChild(blurOverlay);

      ctx = {
        a: canvas.a.getContext('2d'),
      };
    }

    function resize() {
      const parentElement = containerRef.current;
      const width = parentElement.clientWidth;
      const height = parentElement.clientHeight;

      canvas.a.width = width;
      canvas.a.height = height;
    }

    function draw() {
      ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
      updateCircles();
    }

    createCanvas();
    resize();
    initCircles();

    tickerRef.current = gsap.ticker.add(draw);

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="content--canvas absolute left-0 top-0 h-[300px] w-full overflow-hidden rounded-t-2xl"
    />
  );
}
