module State (
    State(..)
  , Player(..)
  , initialState
) where


data State = State {
    players :: [Player]
} deriving (Show)

data Player = Player {
    playerId :: String
  , playerPos :: (Double,Double)
  , playerVel :: (Double,Double)
  , playerStanding :: Bool
} deriving (Show)


initialState :: State
initialState = State []

