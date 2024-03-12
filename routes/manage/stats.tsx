// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import Chart from "@/islands/chart.tsx";
import Head from "@/components/head.tsx";
import TabsBar from "@/components/tabs-bar.tsx";
import { HEADING_WITH_MARGIN_STYLES } from "@/utils/constants.ts";
import { defineRoute } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";

function randomNumbers(length: number, ceil: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * ceil));
}

export default defineRoute((_req, ctx) => {
  const labels = [
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar",
  ];
  const datasets = [
    {
      label: "Kullanıcı girişleri",
      data: randomNumbers(labels.length, 26),
      borderColor: "#be185d",
    },
    {
      label: "Yeni kullanıcı",
      data: randomNumbers(labels.length, 5),
      borderColor: "#e85d04",
    },
    {
      label: "Oluşturulan soru",
      data: randomNumbers(labels.length, 3),
      borderColor: "#219ebc",
    },
    {
      label: "Oylama",
      data: randomNumbers(labels.length, 11),
      borderColor: "#4338ca",
    },
  ];

  return (
    <>
      <Head title="Editor Paneli" href={ctx.url.href} />
      <main class="flex-1 p-4 flex flex-col f-client-nav">
        <h1 class={HEADING_WITH_MARGIN_STYLES}>Editor Paneli</h1>
        <TabsBar
          links={[{
            path: "/manage/stats",
            innerText: "İstatistikler",
          }, {
            path: "/manage/users",
            innerText: "Kullanıcılar",
          }]}
          currentPath={ctx.url.pathname}
        />
        <Partial name="stats">
          <div class="flex-1 relative">
            <Chart
              type="line"
              options={{
                maintainAspectRatio: false,
                interaction: {
                  intersect: false,
                  mode: "index",
                },
                scales: {
                  x: {
                    grid: { display: false },
                  },
                  y: {
                    beginAtZero: true,
                    grid: { display: false },
                    ticks: { precision: 0 },
                  },
                },
              }}
              data={{
                labels,
                datasets: datasets.map((dataset) => ({
                  ...dataset,
                  pointRadius: 0,
                  cubicInterpolationMode: "monotone",
                })),
              }}
            />
          </div>
        </Partial>
      </main>
    </>
  );
});
