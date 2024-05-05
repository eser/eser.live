// Copyright 2023-present the Deno authors. All rights reserved. MIT license.
import { Chart } from "./(_islands)/chart.tsx";
import { Head } from "@/pkg/main/components/head.tsx";
import { TabsBar } from "@/pkg/main/components/tabs-bar.tsx";
import { type State } from "@/pkg/main/plugins/session.ts";
import { defineRoute } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";

function randomNumbers(length: number, ceil: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * ceil));
}

export default defineRoute<State>((_req, ctx) => {
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
      <Head title="İstatistikler" href={ctx.url.href} />
      <main>
        <div>
          <h1>Panel</h1>
          <TabsBar
            links={[
              {
                path: "/dash",
                innerText: "Hesabım",
                isVisible: true,
              },
              {
                path: "/dash/stats",
                innerText: "İstatistikler",
                isVisible: (ctx.state.isEditor === true),
              },
              {
                path: "/dash/users/",
                innerText: "Kullanıcılar",
                isVisible: (ctx.state.isEditor === true),
              },
            ]}
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
        </div>
      </main>
    </>
  );
});
