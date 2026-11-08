# DeployPipeline
A deploy's stages left to right: Pull, Build, Test, Freigabe, Release, Health check.

Each stage is a cell with name, status shape, duration in mono; the running stage has an `info` underline, a failed one `danger`. The approval stage appears for agent-triggered deploys and links to the ApprovalCard. Click a stage to open its LogView. Rollback is one action on the last successful release.
