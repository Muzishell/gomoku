Pour changer l'IA :

L'IA entière se trouve dans ai/ai.js, le jeu en lui-même appelle seulement la fonction findPlay dans game/gameplay.js

En gros c'est un minmax, randomisé sur les décisions à valeur équivalente.
L'algorithme en soi ne devrait pas être changé mais tu peux essayer à tes propres frais.

La chose qui influe le plus sur les décisions, est la fonction "assignValue" qui fait plusieurs check successifs sur une case pour lui attribuer une "valeur", au fait de jouer un pion à cet endroit.
Du coup on peux :
- Jouer sur les valeurs de chaque check (qui se trouve dans la variable value tout en haut du fichier)
- Rajouter des checks qui sont pertinent pour l'instant il y'a :
  	   - Le pion peux se faire manger
	   - Le pion mangera deux pions
	   - Si il y'a 3/4 pions alliés/ennemis
	   (Du coup 6 checks, à savoir que c'est une fonction appellée pour chaque case adjacente d'un pion * la profondeur de l'ia)

Dans la fonction principale, la variable depth est égale à la profondeur, c'est à dire le nombre de coup d'avance analysé par l'ia. Du coup tu peux aussi jouer avec.