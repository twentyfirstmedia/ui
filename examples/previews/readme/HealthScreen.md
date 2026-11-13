# HealthScreen

A personal health page in the app shell with a sidebar: vitals with healthy ranges, an insight with
its reason, activity rings, last night's sleep and today's medication.


The whole screen is glass over `Ambient`: one `<UIProvider surface="glass">` turns the shell, the
sidebar, panels and the Life cards (vitals, goals, insights, journal entries) into glass, with
inputs and chips on them translucent too. Without the provider the same markup is solid.
