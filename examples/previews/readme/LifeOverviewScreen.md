# LifeOverviewScreen

The start page of an AI-first life app: what needs you today across health, money and papers,
as insights with their reasons, the next deadlines, budgets, mood and activity.


The whole screen is glass over `Ambient`: one `<UIProvider surface="glass">` turns the shell, the
sidebar, panels and the Life cards (vitals, goals, insights, journal entries) into glass, with
inputs and chips on them translucent too. Without the provider the same markup is solid.
