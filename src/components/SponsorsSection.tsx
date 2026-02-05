import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string | null;
}

const tierConfig = {
  platinum: { label: "Bạch Kim", bg: "bg-gradient-to-br from-slate-100 to-slate-300", border: "border-slate-400" },
  gold: { label: "Vàng", bg: "bg-gradient-to-br from-yellow-50 to-amber-200", border: "border-amber-400" },
  silver: { label: "Bạc", bg: "bg-gradient-to-br from-gray-50 to-gray-200", border: "border-gray-400" },
  bronze: { label: "Đồng", bg: "bg-gradient-to-br from-orange-50 to-orange-200", border: "border-orange-400" },
};

export const SponsorsSection = () => {
  const { data: sponsors, isLoading } = useQuery({
    queryKey: ["sponsors-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Sponsor[];
    },
  });

  const groupedSponsors = sponsors?.reduce((acc, sponsor) => {
    const tier = sponsor.tier || "bronze";
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(sponsor);
    return acc;
  }, {} as Record<string, Sponsor[]>);

  const tierOrder = ["platinum", "gold", "silver", "bronze"];

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <Skeleton className="h-12 w-64 mx-auto mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
            Nhà Tài Trợ & Đối Tác
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cảm ơn những tấm lòng vàng đã đồng hành cùng ARC HOPE trong sứ mệnh mang giáo dục đến mọi người
          </p>
        </div>

        <div className="space-y-12">
          {tierOrder.map((tier) => {
            const tierSponsors = groupedSponsors?.[tier];
            if (!tierSponsors || tierSponsors.length === 0) return null;

            const config = tierConfig[tier as keyof typeof tierConfig];

            return (
              <div key={tier} className="space-y-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px bg-border flex-1 max-w-[100px]" />
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.border} border`}>
                    {config.label}
                  </span>
                  <div className="h-px bg-border flex-1 max-w-[100px]" />
                </div>

                <div className={`grid gap-6 ${
                  tier === "platinum" 
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                    : tier === "gold" 
                    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                }`}>
                  {tierSponsors.map((sponsor) => (
                    <a
                      key={sponsor.id}
                      href={sponsor.website_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center justify-center p-6 rounded-2xl ${config.bg} ${config.border} border-2 transition-all duration-300 hover:shadow-warm hover:-translate-y-1 ${
                        tier === "platinum" ? "min-h-[120px]" : tier === "gold" ? "min-h-[100px]" : "min-h-[80px]"
                      }`}
                    >
                      {sponsor.logo_url ? (
                        <img
                          src={sponsor.logo_url}
                          alt={sponsor.name}
                          className={`object-contain transition-transform duration-300 group-hover:scale-110 ${
                            tier === "platinum" ? "max-h-20" : tier === "gold" ? "max-h-16" : "max-h-12"
                          }`}
                        />
                      ) : (
                        <span className={`font-playfair font-semibold text-primary text-center ${
                          tier === "platinum" ? "text-xl" : tier === "gold" ? "text-lg" : "text-sm"
                        }`}>
                          {sponsor.name}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
