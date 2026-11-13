# HabitsScreen

A daily check-in: the mood scale and a line for the journal, the week's habits, the latest entry
and longer goals beside it.


The whole screen is glass over `Ambient`: one `<UIProvider surface="glass">` turns the shell, the
sidebar, panels and the Life cards (vitals, goals, insights, journal entries) into glass, with
inputs and chips on them translucent too. Without the provider the same markup is solid.
