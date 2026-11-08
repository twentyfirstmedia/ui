# ChatList
The left column of the ChatWorkspace: search, filters and all conversations.

**Groups, in this order**
1. **Angepinnt**: Main Brain always first; users can pin more.
2. **One group per project** (CI square + name, config order), agents sorted by last activity.
3. **Agent-Gespräche**: agent-to-agent threads (paired avatars, project tag). Read-only until you step in.

**Row:** avatar with status shape, name, time (mono), last message (one line), signal count for open approvals, neutral count for unread. Unread rows set the name in 600 weight. The selected row gets `bg-300` and a 1px accent bar.

**Filters:** Alle / Ungelesen / Freigaben. The search field searches names and the full history (see ChatSearch). Idle agents with no history in 30 days collapse into "n weitere".
