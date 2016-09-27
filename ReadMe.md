## Feeds monitoring

This project aims to watchone or more JSON feeds and log the times of any changes; I'd like to monitoor some golf feeds to see the delays between them. Some may be XML

The plan is to do, 
- add a set of urls to the database
- log results to database
- open socket server to show changes
- simple web page to list the recent chhanges
- compare feed timings

Delete the Viz stuff...
- Currently creates the Viz socket and web socket and just passes some pre set commands over.

??
- Added tests for monitoring/redirecting a UDP stream and writing messages to mongodb


