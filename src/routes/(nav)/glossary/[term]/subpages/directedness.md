# Directedness: A Classification of Polyominoes

When I was creating this Labyrinth, a very, very important question percolated in my mind: what do I color the polyominoes? Obviously I can't leave them just one color; that would be too boring. I can't just make them _random_ either. I'm a dataviz girlie: I want whatever coloring scheme I use to _mean_ something. Something that seems fundamental to the structure of these minos. But what?

The closest thing to "canonical" we can use is symmetry. It's what [Wikipedia uses][]:

I've been familiar with this color scheme since high school, and it's been seared into my head ever since. It's a sensible one. Human brains are wired to see symmetry and pattern and equate it to beauty. And so I [added symmetry](/symmetry) to the labyrinth. But if we move up to the heptominoes and octominoes, we see a problem:

Most of these minos are boring ol' grey! And the problem gets worse with bigger sizes of polyominoes:

(table for larger sizes)

Another fun possibility I tried was classifying minos by _graph_. putting a point in the center of each square, joining adjacent squares by lines, and throwing away the original squares and any notion of turning or direction. You can take this further and get rid of the dots that don't connect more than two points, to get "families" of minos, such as "minos that are a straight line", and "minos that are T intersections".

But there is another problem with this. The number of graphs, or graph families, grows unbounded with the size of the mino. Each successive size introduces new classes of graphs, and even though there are a plethora of colors, there really aren't that many we can tell apart well.

Let's formalize our criteria. We want a classification of polyominoes that:

1. Meaningfully encodes some interesting property of them
2. Is fixed, and does not grow unbounded as the size $n$ increases (unlike graphs)
3. Has an interesting "spread" (i.e. is not mostly grey) for our desired size of $n \le 8$ (unlike symmetry)

It's always a good idea to check on prior work, so let's do so and see what we find!

## The Mathworld Classification

Let's do the lazy student's research technique: we'll follow the Wikipedia links for "Polyomino" and see what shows up. It seems that [Wolfram Mathworld] has a couple of articles related to polyominoes:

<!-- TODO: list all the articles -->

- [Convex Directed Polyomino]
- ...

These articles seem to specify different groups of polyominoes, so maybe that's what we're looking for? We could just plop in the colors from these articles and call it a day. But we run into some problems:

1. Why _these_ classes?
2. What if a polyomino belongs in two different classes?
3. What if someone discovers (or defines) a new class? Would we need to amend our list?

For the first question, we have to go back to one of the fundamental things that makes polyominoes so fascinating: _we don't have a formula for how to calculate them_. Restricting polyominoes to certain classes allows us to find formulas (more specifically: generating functions) for counting the number of polyominoes, which might help us solve the bigger question of how many polyominoes there are. Indeed, most of these articles list the (obscenely complicated) generating functions of the classes they describe.

For the second question... well, it's true. A directed convex polyomino is always convex, a convex polyomino is always column- and row-convex, and so on. But if we create a _hierarchy_ of classes, we can list a polyomino as belonging to the class of the "highest" condition it satisfies, just like symmetry:

<!-- TODO diagram of the wolfram alpha classes -->

It's not too hard to show that, for example, a mino that is both a staircase and a stack necessarily has to be a Ferrers diagram polyomino.

The third condition is a little bit harder. After all, we could just add one of our symmetry classes to this list and that's a new color we can add (and it'll invalidate Point 2 as well).

Our previous two classification attempts had a nice ring to them: you could describe each class as some configuration of a universal property. "These are all the ways that a polyomino can be symmetric". "These are all the ways that a mino can be topologically equivalent". The classes are related by a common feature. Now we just need to do that for our Mathworld classes.

### Systemitization: Convexity and Directedness

A couple of words keep coming up in these definitions: _convex_ and _directed_.

A convex polyomino is easy to intuit: it's a polyomino where there aren't any "horseshoe" segments, or concavities. Formally, you can draw a line through any column or row and it will not cut through two different segments of the mino. We can use "row-convex" or "column-convex" (or generally, "semi-convex") to denote a polyomino that you can draw that line in one direction, or another.

"Directed" is a tougher nut to crack. The Mathworld articles don't directly state it, but it means that every cell of the polyomino can be reached by going right or up from a starting square. Intuitively, it means that if you hold the mino up diagonally and drop a marble in it, it can conceivably reach every square without breaking the law of gravity.

We can use these two definitions to categorize all the classes. A staircase is a convex polyomino that is directed from two opposite corners. A stack is a polyomino that is directed from two adjacent corners, and so on.

We can reasonably stop here and be satisfied with our classification. But _I'm_ not. Why are _convexity_ and _directedness_ the two properties we care about? Why not symmetry and convexiy, or graphs and directedness? We must keep looking for more underlying principles.

## Interlude I: Shapes Families

<!-- TODO talk about families of polyiminoes and what they have in common -->

## Orthogonal directedness

One of the joys of math is to take a thing and loosen it up, expand it, ease up on restrictions, and see what mathematics comes out. We can do this with the notion of "directedness" to solve our conundrum. Instead of reaching any square by going right and up, what if we consider minos where you can reach any square by going left, right, or up? In our intuitive analogy, instead of hanging our mino by a corner we keep it loose and let a marble roll down:

<!-- TODO: note that a marble can "drift" to a side, like it richocheting off a wall. -->

**Theorem** A [punctureless](/glossary/puncture) polyomino that is orthogonally directed from two opposite sides is semi-convex.

<!-- TODO prove theorem -->

Note that we specify _punctureless_: that is, a mino with no internal holes. We'll deal with punctured minos later.

But for now, we can replace our definitions on convexity with orthogonal directedness. We can use the notation $Dir_{o}^{d}$ where $o$ denotes the number of sides a mino is orthogonally directed from, and $d$ denotes the number of corners. When $o$ or $d = 2$, we specify $c$ (for cis-) for two adjacent sides/corners or $t$ (for trans-) for opposite sides/corners. We now have a hierarchy that relies only only on one concept ("how many directions do you need to reach every cell"). But our classification still relies on two definitions: the allegory of convexity only applies to minos without punctures. How can we generalize this to _every_ mino?

## Interlude II: Boundary Words

Let's take a break and think about polyomino "families" again. One way we can formalize it is to think in terms of _boundary words_. That is, if you start at a point in a corner of a mino, and go around counterclockwise, denoting every independent direction that you go in until you reach the beginning again.

<!-- TODO realization that boundary word families share the same class -->

## Putting it Together

<!-- TODO prove that members of a boundary family have same directedness -->

<!-- TODO make regexes of boundary words -->

## Dealing with Punctures

<!-- TODO do the theorem that the internal boundary words of minos with punctures  -->

## Next steps
