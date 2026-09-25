"use client";

import { useMemo } from "react";
import { AutocompleteInput } from "@/components/ui/AutocompleteInput";
import {
  allCityNames,
  canonicalState,
  citiesInState,
  indianStates,
  stateForCity,
} from "@/lib/india-locations";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive";

// The City and State inputs of an address form, both with type-ahead
// suggestions. Picking a city fills in its state; once a state is chosen, that
// state's cities are suggested first. State must be one of the real
// states/UTs; a city that isn't in the list can still be typed in.
// Renders two <label> blocks so it drops straight into the form's grid.
export function CityStateFields({
  city,
  state,
  onCityChange,
  onStateChange,
}: {
  city: string;
  state: string;
  onCityChange: (city: string) => void;
  onStateChange: (state: string) => void;
}) {
  const cityOptions = useMemo(() => {
    const inState = citiesInState(state);
    if (inState.length === 0) return allCityNames;
    const set = new Set(inState);
    return [...inState, ...allCityNames.filter((c) => !set.has(c))];
  }, [state]);

  return (
    <>
      <label className="block">
        <span className="text-xs font-medium text-charcoal">
          City <span className="text-terracotta-dark">*</span>
        </span>
        <AutocompleteInput
          required
          value={city}
          onChange={onCityChange}
          onSelect={(picked) => {
            const matchingState = stateForCity(picked);
            if (matchingState) onStateChange(matchingState);
          }}
          options={cityOptions}
          autoComplete="off"
          placeholder="Start typing your city"
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-charcoal">
          State <span className="text-terracotta-dark">*</span>
        </span>
        <AutocompleteInput
          required
          value={state}
          onChange={onStateChange}
          options={indianStates}
          minChars={0}
          maxSuggestions={40}
          validityMessage={state.trim() && !canonicalState(state) ? "Choose a state from the list" : ""}
          onBlur={() => {
            // "maharashtra" -> "Maharashtra"
            const canonical = canonicalState(state);
            if (canonical && canonical !== state) onStateChange(canonical);
          }}
          placeholder="Select your state"
          className={inputClass}
        />
      </label>
    </>
  );
}
