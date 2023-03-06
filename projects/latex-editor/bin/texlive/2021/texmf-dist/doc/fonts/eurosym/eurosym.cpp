// -*- Mode: C++ -*-

#include <fig.h>

int main (int, char **)
{
    // These measures are taken from an ``official'' Euro symbol
    // that is programmed in PostScript (which turns out not to
    // use the correct measures.

    // However, let's view the values in mm.
    Fig::unit= Fig::mm;

    // Default angle unit is degrees:
    Fig::angle_unit= Fig::deg;

    // The origin is at the center of the arcs.
    // Inner Arc:
    FigDimension const inner_arc_radius= 67.5;
    FigAngle     const inner_arc_angle1= 40.0;
    FigAngle     const inner_arc_angle2= 320.0;

    // Outer Arc:
    FigDimension const outer_arc_radius= 77.5;     // Hmmm...  It can be seen that the line width
                                                   // is 10 units.  So the inner radius contradicts
                                                   // the official construction; if must be 5 units
                                                   // and the outer one 6 units.
    FigDimension const outer_arc_angle1= 311.8513;
    FigDimension const outer_arc_angle2= 43.68390;

    // However, just for the fun of it, continue to write the rest as a fig-file, too:

    FILE *f=fopen ("eurosym.fig", "wt");
    (new FigFile (
        FigVectorWidget ()
        << (new FigCEllipse (0, 0, inner_arc_radius)) // instead of arc, use a circle for now
        << (new FigCEllipse (0, 0, outer_arc_radius))
        << (new FigClosedPoly (
               FigVectorPoint()
               << FigPoint (26.73339, -15)
               << FigPoint (-97.5,    -15)
               << FigPoint (-93.22267, -5)
               << FigPoint (31.010728, -5)
               << FigPoint (26.73339, -15)
           ))
        << (new FigClosedPoly (
               FigVectorPoint()
               << FigPoint (35.28807,  5)
               << FigPoint (-97.5,     5)
               << FigPoint (-93.22267, 15)
               << FigPoint (39.56541,  15)
               << FigPoint (35.28807,  5)
           ))
    ))->scale (1, -1)
      ->translate (120, 100)
      ->save (f);
    fclose (f);

    return 0;
}