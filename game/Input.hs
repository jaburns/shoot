module Input (
    Input(..)
  , defaultInput
  , pressed
  , held
  , released
) where


type InputButton = (Bool,Bool,Bool)

pressed :: InputButton -> Bool
pressed (a,b,c) = a

held :: InputButton -> Bool
held (a,b,c) = b

released :: InputButton -> Bool
released (a,b,c) = c


data Input = Input {
    left :: InputButton
  , right :: InputButton
  , jump :: InputButton
} deriving (Show)

defaultInput :: Input
defaultInput = Input nope nope nope
  where
    nope = (False,False,False)
