<script lang="ts" module>
  // Values up to n=11 taken from stats.spec.ts. Larger values taken from calculations in Rust.
  const directednessCounts = [
    {
      rectangle: 1,
    },
    {
      rectangle: 1,
    },
    {
      rectangle: 1,
      wedge: 1,
    },
    {
      rectangle: 2,
      stack: 1,
      staircase: 1,
      wedge: 1,
    },
    {
      "bar chart": 1,
      diamond: 1,
      fork: 1,
      rectangle: 1,
      stack: 2,
      staircase: 3,
      wedge: 3,
    },
    {
      "bar chart": 3,
      crescent: 1,
      diamond: 2,
      fork: 6,
      rectangle: 2,
      stack: 6,
      staircase: 9,
      wedge: 4,
      wing: 2,
    },
    {
      antler: 1,
      "bar chart": 10,
      crescent: 8,
      diamond: 8,
      fork: 22,
      "range chart": 1,
      rectangle: 1,
      stack: 11,
      staircase: 23,
      wedge: 7,
      wing: 16,
    },
    {
      antler: 5,
      "bar chart": 27,
      "bent tree": 3,
      crescent: 55,
      diamond: 27,
      fork: 72,
      "range chart": 7,
      rectangle: 3,
      stack: 23,
      staircase: 57,
      wedge: 10,
      wing: 80,
    },
    {
      antler: 34,
      "bar chart": 67,
      "bent tree": 43,
      crescent: 280,
      diamond: 81,
      fork: 208,
      "range chart": 52,
      rectangle: 2,
      stack: 40,
      staircase: 134,
      tree: 2,
      wedge: 15,
      wing: 327,
    },
    {
      antler: 171,
      "bar chart": 160,
      "bent tree": 325,
      crescent: 1234,
      diamond: 240,
      fork: 564,
      "range chart": 326,
      rectangle: 3,
      stack: 75,
      staircase: 321,
      tree: 34,
      wedge: 23,
      wing: 1179,
    },
    {
      antler: 777,
      "bar chart": 360,
      "bent tree": 2012,
      crescent: 4824,
      diamond: 663,
      fork: 1458,
      other: 5,
      "range chart": 1751,
      rectangle: 2,
      stack: 130,
      staircase: 745,
      tree: 382,
      wedge: 34,
      wing: 3930,
    }, // TODO 12 and up
    {
      fork: 3674,
      diamond: 1810,
      staircase: 1756,
      tree: 3121,
      wing: 12406,
      "range chart": 8515,
      "bent tree": 10438,
      "bar chart": 804,
      crescent: 17505,
      wedge: 54,
      antler: 3203,
      stack: 237,
      rectangle: 5,
      other: 72,
    },

    {
      wedge: 84,
      wing: 37696,
      diamond: 4724,
      staircase: 4077,
      "bent tree": 48827,
      crescent: 59850,
      fork: 9090,
      "range chart": 37811,
      antler: 12378,
      tree: 21046,
      stack: 418,
      other: 846,
      "bar chart": 1741,
      rectangle: 3,
    },
    {
      rectangle: 7,
      fork: 22224,
      tree: 124039,
      "range chart": 158073,
      antler: 45487,
      "bar chart": 3769,
      staircase: 9571,
      crescent: 196339,
      wing: 111394,
      diamond: 12256,
      "bent tree": 210318,
      stack: 770,
      wedge: 132,
      other: 7592,
    },
    {
      "bar chart": 8035,
      diamond: 31121,
      wing: 322440,
      "bent tree": 854560,
      "range chart": 627741,
      rectangle: 5,
      stack: 1391,
      tree: 662857,
      antler: 160982,
      other: 57798,
      wedge: 212,
      fork: 53912,
      crescent: 623213,
      staircase: 22309,
    },
    {
      staircase: 52313,
      "range chart": 2401615,
      fork: 130089,
      tree: 3290757,
      other: 387708,
      wing: 918786,
      stack: 2578,
      antler: 553085,
      "bar chart": 17158,
      wedge: 344,
      rectangle: 12,
      diamond: 78816,
      "bent tree": 3315634,
      crescent: 1930360,
    },
  ]

  const classes = [
    "rectangle",
    "wedge",
    "staircase",
    "stack",
    "fork",
    "bar chart",
    "diamond",
    "wing",
    "crescent",
    "antler",
    "range chart",
    "bent tree",
    "tree",
    "other",
  ]
  export { classTable }
</script>

{#snippet classTable()}
  <table>
    <thead>
      <tr>
        <th>n</th>
        {#each classes as cls}
          <th>{cls}</th>
        {/each}</tr
      >
    </thead>
    <tbody>
      {#each directednessCounts as map, n}
        <tr>
          <td>{n + 1}</td>
          {#each classes as cls}
            <td>{(map as any)[cls]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
{/snippet}

<style>
  table {
    table-layout: fixed;
    /* width: fit-content; */
    overflow-x: scroll;
  }

  td {
    border: 1px solid var(--color-border);
    text-align: right;
    padding-inline: 0.5rem;
  }
</style>
