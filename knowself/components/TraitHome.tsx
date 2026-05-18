import type { InterpretationsData } from "@/lib/interpretations";
import { TraitHomeBody } from "@/components/trait-home/TraitHomeBody";
import { TraitHomeHeader } from "@/components/trait-home/TraitHomeHeader";
import { TraitPageFooter } from "@/components/trait-home/TraitPageFooter";

type Props = {
  data: InterpretationsData;
};

/** Server shell: static header/footer; interactive landing lives in `TraitHomeBody`. */
export function TraitHome({ data }: Props) {
  return (
    <div className="relative min-h-full overflow-x-hidden text-foreground">
      <TraitHomeHeader />
      <TraitHomeBody data={data} />
      <TraitPageFooter />
    </div>
  );
}
