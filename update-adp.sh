#!/bin/bash
curl "https://fantasyfootballcalculator.com/api/v1/adp/half-ppr?teams=12&year=2021" -o player-adp.json
curl "https://api.sleeper.app/projections/nfl/2021?season_type=regular&position[]=DEF&position[]=K&position[]=QB&position[]=RB&position[]=TE&position[]=WR&order_by=adp_half_ppr" -o player-adp-sleeper.json