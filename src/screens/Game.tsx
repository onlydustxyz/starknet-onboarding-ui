import { useMemo } from "react";
import { useWindowSize } from "react-use";

import Board from "src/components/Board";
import Header from "src/components/Header";
import Loader from "src/components/Loader";
import useGameState from "src/hooks/useGameState";
import useGrid from "src/hooks/useGrid";

const headerHeight = 122;
const gapSize = 16;

export default function Game() {
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const { gameStateReady, gridSize, events } = useGameState();
  const { dusts, ships, play, pause, resetAndPlay, isPlaying, winner, currentTurn } = useGrid(events);

  const containerStyle = useMemo(() => {
    const leftPadding = Math.floor(headerHeight / 2);

    return {
      paddingLeft: leftPadding,
      paddingRight: headerHeight - leftPadding,
    };
  }, [headerHeight]);

  const boardSize = useMemo(() => {
    const possibleSize = Math.min(windowHeight - headerHeight, windowWidth);

    return possibleSize - 3 * gapSize;
  }, [windowHeight, windowWidth]);

  const boardStyle = useMemo(() => {
    return {
      height: `${boardSize}px`,
      width: `${boardSize}px`,
      marginBottom: `${gapSize}px`,
    };
  }, [boardSize]);

  const headerStyle = useMemo(() => {
    return {
      marginBottom: `${gapSize}px`,
      marginTop: `${gapSize}px`,
      height: headerHeight,
    };
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-orange-400" style={containerStyle}>
      {renderGame()}
    </div>
  );

  function renderGame() {
    if (gameStateReady) {
      return (
        <div>
          <Header
            style={headerStyle}
            start={play}
            pause={pause}
            replay={resetAndPlay}
            isPlaying={isPlaying}
            ships={ships}
            winner={winner}
            currentTurn={currentTurn}
          />
          <Board
            boardSize={boardSize}
            style={boardStyle}
            gridSize={gridSize as number}
            dusts={dusts}
            ships={ships}
            winner={winner}
          />
        </div>
      );
    }

    return <Loader message={!gameStateReady ? "Loading game state" : "Loading grid"} />;
  }
}
