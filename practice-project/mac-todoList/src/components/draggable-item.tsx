import React, { useState, useRef, useEffect, useCallback } from "react";

import { useSelectedItem } from "../context/selectItem-provider";

interface Position {
  x: number;
  y: number;
}

interface DragOffset {
  x: number;
  y: number;
}

interface DraggableItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

export function DraggableItem({ id, name, imageUrl }: DraggableItemProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 });
  const { selectedId, setSelectedId } = useSelectedItem();

  const elementRef = useRef<HTMLDivElement>(null);
  const startPosition = useRef<Position>({ x: 0, y: 0 });
  console.log(startPosition.current);

  const imgUrl = new URL(`../assets/${imageUrl}`, import.meta.url).href;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSelectedId(id);
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setSelectedId(id);
    setIsDragging(true);
    const rect = elementRef.current?.getBoundingClientRect();

    if (!rect) {
      console.error("Element not found");
      return;
    }
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    console.log(
      id,
      {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
      rect.left,
      rect.top,
      e.clientX,
      e.clientY
    );
  };
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const container = elementRef.current?.parentElement;
      const containerRect = container?.getBoundingClientRect();
      const elementRect = elementRef.current?.getBoundingClientRect();

      if (containerRect === undefined || elementRect === undefined) {
        console.error("Container or element not found");
        return;
      }

      let newX = e.clientX - startPosition.current.x - dragOffset.x;
      let newY = e.clientY - startPosition.current.y - dragOffset.y;
      console.log(id, "newX:", newX, "newY:", newY, e.clientX, e.clientY);

      // 边界检测
      newX = Math.max(
        0,
        Math.min(newX, containerRect.width - elementRect.width)
      );
      newY = Math.max(
        0,
        Math.min(newY, containerRect.height - elementRect.height)
      );

      setPosition({ x: newX, y: newY });
    },
    [isDragging, dragOffset]
  );
  const handleMouseUp = useCallback((): void => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  // Initialize startPosition with the element's initial position
  useEffect(() => {
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      startPosition.current = {
        x: rect.left,
        y: rect.top,
      };
    }
    console.log("初始位置", startPosition.current);
  }, []);
  return (
    <div
      className={`w-26 h-26 cursor-move  bg-center bg-cover flex items-center flex-col`}
      ref={elementRef}
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div
        className={`w-20 h-20 p-0.9 ${
          selectedId === id
            ? "rounded-sm shadow-md bg-black/30 border-white/20 border-2"
            : ""
        } `}
      >
        <div
          className={`bg-center bg-cover size-full`}
          onClick={handleClick}
          style={{
            backgroundImage: imgUrl ? `url(${imgUrl})` : undefined,
            backgroundColor: !imgUrl ? "#f0f0f0" : undefined,
          }}
        ></div>
      </div>
      <div className="text-sm text-white text-shadow-[-0px_4px_12px_black] mt-0.5">
        {name}
      </div>
    </div>
  );
}
